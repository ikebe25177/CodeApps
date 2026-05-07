param (
  [string]$Workspace = "https://make.powerapps.com/environments/91c808ac-8704-ea1c-bcd8-27eac0cddab8",
  [string]$EnvironmentId = "91c808ac-8704-ea1c-bcd8-27eac0cddab8",  
  [string]$RepoUrl = "https://github.com/microsoft/PowerAppsCodeApps.git",
  [string]$SampleRel = "samples\HelloWorld",
  [ValidateSet('deviceCode', 'interactive', 'none')]
  [string]$AuthMode = 'deviceCode',
  [switch]$StartDev,
  [switch]$BuildAndPush,
  [switch]$InstallPrereqs,
  [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Platform detection for older PowerShell versions
if (-not (Test-Path variable:\IsWindows)) {
  try {
    $IsWindows = [System.Runtime.InteropServices.RuntimeInformation]::IsOSPlatform([System.Runtime.InteropServices.OSPlatform]::Windows)
  } catch {
    # Fallback for Windows PowerShell where RuntimeInformation may not exist
    $IsWindows = $env:OS -and $env:OS -like '*Windows*'
  }
}

function Install-Prerequisites {
    param([switch]$Force)

    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        Write-Warning "winget not found. Please install winget manually or run with administrator privileges: https://learn.microsoft.com/windows/package-manager/"
        return
    }

    $packages = @(
        @{ id = 'Git.Git'; name = 'Git' },
        @{ id = 'OpenJS.NodeJS.LTS'; name = 'Node.js LTS' },
        @{ id = 'Microsoft.PowerApps.CLI'; name = 'Power Apps CLI' }
    )

    foreach ($p in $packages) {
        Write-Host "Installing $($p.name) via winget..."
        try {
            Start-Process -FilePath winget -ArgumentList 'install','--id',$p.id,'-e','--accept-package-agreements','--accept-source-agreements' -NoNewWindow -Wait -ErrorAction Stop
        } catch {
            Write-Warning "Failed to install $($p.name) via winget: $_"
        }
    }

    if (Get-Command code -ErrorAction SilentlyContinue) {
        Write-Host 'Installing Power Platform VS Code extension...'
        try {
            code --install-extension microsoft-IsvExpTools.powerplatform-vscode --force
        } catch {
            Write-Warning "Failed to install VS Code extension: $_"
        }
    } else {
        Write-Host 'VS Code command (code) not found. Please install VS Code and manually add the extension.'
    }

    Write-Host 'Prerequisite installation finished. Please restart the terminal if necessary.'
}

if ($InstallPrereqs) {
    Write-Host 'InstallPrereqs specified - installing required prerequisites...'
    Install-Prerequisites -Force:$Force
}

function Require-Command($name, $installUrl) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    Write-Warning "$name not found. Suggested install: $installUrl"

    # Offer to install prerequisites using the existing Install-Prerequisites function
    $installChoice = Read-Host "Install prerequisites now using winget (may require admin)? (Y/N)"
    if ($installChoice -and $installChoice.ToLower() -eq 'y') {
      if (Get-Command Install-Prerequisites -ErrorAction SilentlyContinue) {
        try {
          Install-Prerequisites -Force
        } catch {
          Write-Warning "Automatic prerequisite installation failed: $_"
        }
      } else {
        Write-Warning "Install-Prerequisites helper not available. Please install $name from $installUrl."
      }
    } else {
      Write-Warning "$name is required but automatic install was skipped."
    }

    # Re-check after attempted install or skip
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
      # Try to locate the executable on disk (common install locations) and add to PATH for current session
      $exeName = if ($name -match 'node|npm') { "$name.exe" } else { "$name.exe" }
      $searchRoots = @()
      if ($env:ProgramFiles) { $searchRoots += $env:ProgramFiles }
  if (${env:ProgramFiles(x86)}) { $searchRoots += ${env:ProgramFiles(x86)} }
      if ($env:LOCALAPPDATA) { $searchRoots += $env:LOCALAPPDATA }
      if ($env:USERPROFILE) { $searchRoots += $env:USERPROFILE }
      $searchRoots += 'C:\Program Files','C:\Program Files (x86)'

      $found = $null
      foreach ($root in $searchRoots | Where-Object { Test-Path $_ }) {
        try {
          $candidate = Get-ChildItem -Path $root -Filter $exeName -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
          if ($candidate) { $found = $candidate; break }
        } catch {
          # ignore and continue
        }
      }

      if ($found) {
        $dir = $found.DirectoryName
        Write-Host "Found $($found.Name) at $dir. Adding to PATH for this session."
        if (-not ($env:Path -split ';' | Where-Object { $_ -ieq $dir })) {
          $env:Path = $env:Path + ';' + $dir
        }

        if (Get-Command $name -ErrorAction SilentlyContinue) {
          Write-Host "$name detected after updating PATH. Continuing..."
          return
        }
      }

      # Final failure - provide clearer diagnostics and actionable steps
      Write-Error "$name still not found after installation attempt and local search. Common fixes:
  - Restart this terminal session after installing Node/npm so PATH updates take effect.
  - Install Node.js for 'All Users' or add its install folder (e.g. C:\Program Files\nodejs) to your PATH.
  - Verify that the executable exists (node.exe / npm.cmd) and is reachable.
Please install manually from $installUrl, restart the terminal, and re-run this script."
      exit 1
    } else {
      Write-Host "$name detected. Continuing..."
    }
  }
}

function Ensure-PacAuth {
  param(
    [Parameter(Mandatory = $true)]
    [string]$EnvironmentId,

    [Parameter(Mandatory = $true)]
    [ValidateSet('deviceCode', 'interactive', 'none')]
    [string]$AuthMode
  )

  if ($AuthMode -eq 'none') {
    Write-Warning 'Authentication is disabled by AuthMode=none. Commands that need a Power Platform environment connection will fail.'
    return $true
  }

  $authArgs = @('auth', 'create', '--environment', $EnvironmentId)
  if ($AuthMode -eq 'deviceCode') {
    $authArgs += '--deviceCode'
  }

  Write-Host "Running pac $($authArgs -join ' ')"

  try {
    & pac @authArgs
    if ($LASTEXITCODE -ne 0) {
      throw "pac auth create failed with exit code $LASTEXITCODE"
    }
    return $true
  } catch {
    Write-Warning @"
Power Platform authentication failed.

Likely causes in this environment:
- interactive browser sign-in cannot open from this container/session
- the signed-in account does not have access to environment $EnvironmentId
- the account can sign in but does not have sufficient maker/customization permissions

Recommended actions:
- use -AuthMode deviceCode when running in this container
- verify the account is assigned to the target environment
- verify the account has one of these effective permission levels:
  - Environment Maker on the target environment, or
  - System Customizer / System Administrator in the Dataverse environment
- if using an application user/service principal, assign an equivalent Dataverse security role

Original error: $_
"@
    return $false
  }
}

Require-Command git 'https://git-scm.com/'
Require-Command node 'https://nodejs.org/'
Require-Command npm 'https://nodejs.org/'

if (-not (Get-Command pac -ErrorAction SilentlyContinue)) {
  Write-Warning "Power Apps CLI (pac) not found. Please install pac: https://learn.microsoft.com/power-platform/developer/cli/install"
  Read-Host -Prompt "Press Enter to continue (Cancel with Ctrl+C)"
}

if (-not (Test-Path $Workspace)) { New-Item -ItemType Directory -Path $Workspace -Force | Out-Null }
Set-Location $Workspace

$repoName = [System.IO.Path]::GetFileNameWithoutExtension($RepoUrl)
$repoDir = Join-Path $Workspace $repoName
if (-not (Test-Path $repoDir)) {
  Write-Host "Cloning $RepoUrl into $repoDir..."
  git clone $RepoUrl
} else {
  Write-Host "Repository already exists at $repoDir. Fetching latest..."
  Push-Location $repoDir
  git fetch --all
  git pull
  Pop-Location
}

$samplePath = Join-Path $repoDir $SampleRel
if (-not (Test-Path $samplePath)) { Write-Error "Sample path not found: $samplePath"; exit 1 }
Set-Location $samplePath
Write-Host "Working directory: $PWD"

Write-Host "Installing npm dependencies..."
if ($IsWindows) { & npm.cmd install } else { & npm install }

if (-not (Test-Path .\power.config.json)) {
  if (Get-Command pac -ErrorAction SilentlyContinue) {
    Write-Host "Initializing code app (pac code init --displayName 'HelloWorld Sample')..."
    pac code init --displayName "HelloWorld Sample" | Out-Null
  } else {
    Write-Warning "power.config.json does not exist and pac is not available for automatic initialization."
  }
} else {
  Write-Host "power.config.json already exists."
}

if ($StartDev) {
  Write-Host "Starting local dev server (npm run dev). Exit with Ctrl+C."
  if ($IsWindows) { & npm.cmd run dev } else { & npm run dev }
  exit 0
}

if ($BuildAndPush) {
  if (-not $Force) {
  $ok = Read-Host "Build and push to environment ${EnvironmentId}? (y/N)"
    if ($ok.ToLower() -ne 'y') { Write-Host "Cancelled"; exit 0 }
  }

  if (-not (Get-Command pac -ErrorAction SilentlyContinue)) {
    Write-Error 'pac not found. Cannot authenticate or push. Install Power Platform CLI first.'
    exit 1
  }

  if (-not (Ensure-PacAuth -EnvironmentId $EnvironmentId -AuthMode $AuthMode)) {
    Write-Error 'Authentication is required before build and push can continue.'
    exit 1
  }

  Write-Host "Building..."
  if ($IsWindows) { & npm.cmd run build } else { & npm run build }
  Write-Host "Pushing to Power Apps..."
  pac code push --environment $EnvironmentId
  Write-Host "Push completed."
}

Write-Host "Done. Use -StartDev or -BuildAndPush "