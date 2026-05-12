# register_tasks.ps1 — ConduitScore
# Registers Windows Scheduled Tasks for directory submission batches.
#
# Run once from PowerShell (as Administrator):
#   powershell -ExecutionPolicy Bypass -File scripts\register_tasks.ps1
#
# Verify after:
#   schtasks /Query /FO LIST /TN ConduitScore-Batch1

$python  = "C:\Program Files\Python314\python.exe"
$scripts = "C:\Users\Administrator\Desktop\ConduitScore\scripts"

# Confirm python exists
if (-not (Test-Path $python)) {
    # Fallback to py launcher
    $pyCmd = Get-Command python -ErrorAction SilentlyContinue
    $python = if ($pyCmd) { $pyCmd.Source } else { $null }
    if (-not $python) {
        Write-Error "Python not found. Install Python 3.x and update `$python in this script."
        exit 1
    }
}

Write-Host "Using Python: $python"
Write-Host "Scripts dir:  $scripts"
Write-Host ""

# Create launchers dir
$launchersDir = "$scripts\launchers"
New-Item -ItemType Directory -Force -Path $launchersDir | Out-Null

# ── Step 1: Run select_directories.py once to generate selected_directories.json ──
Write-Host "Running select_directories.py to build directory list..."
& $python "$scripts\select_directories.py"
if ($LASTEXITCODE -ne 0) {
    Write-Error "select_directories.py failed. Fix errors before scheduling tasks."
    exit 1
}
Write-Host ""

# ── Step 2: Create .bat launchers for each batch ──
# (schtasks.exe has trouble with long paths and Python args; .bat wrappers are reliable)

$tasks = @(
    @{ Name="ConduitScore-Health"; Bat="health.bat";  Args="--health";   Hour="08"; Minute="00" },
    @{ Name="ConduitScore-Batch1"; Bat="batch1.bat";  Args="--batch 1";  Hour="09"; Minute="00" },
    @{ Name="ConduitScore-Batch2"; Bat="batch2.bat";  Args="--batch 2";  Hour="10"; Minute="30" },
    @{ Name="ConduitScore-Batch3"; Bat="batch3.bat";  Args="--batch 3";  Hour="12"; Minute="00" },
    @{ Name="ConduitScore-Batch4"; Bat="batch4.bat";  Args="--batch 4";  Hour="13"; Minute="30" },
    @{ Name="ConduitScore-Batch5"; Bat="batch5.bat";  Args="--batch 5";  Hour="15"; Minute="00" },
    @{ Name="ConduitScore-Batch6"; Bat="batch6.bat";  Args="--batch 6";  Hour="16"; Minute="30" }
)

foreach ($task in $tasks) {
    $batFile = "$launchersDir\$($task.Bat)"
    $batContent = "@echo off`r`n`"$python`" `"$scripts\directory_submitter.py`" $($task.Args) >> `"$scripts\logs\$($task.Bat -replace '.bat','')_%date:~-4,4%-%date:~-10,2%-%date:~-7,2%.log`" 2>&1`r`n"
    Set-Content -Path $batFile -Value $batContent -Encoding ASCII
    Write-Host "Created launcher: $batFile"
}

Write-Host ""

# ── Step 3: Register Windows Scheduled Tasks ──
foreach ($task in $tasks) {
    $batFile = "$launchersDir\$($task.Bat)"
    $taskName = $task.Name
    $startTime = "$($task.Hour):$($task.Minute)"

    # Delete existing task if present
    schtasks /Delete /TN $taskName /F 2>$null | Out-Null

    # Create new task — runs daily at specified time
    # Note: /RL HIGHEST requires elevation; omit if not running as true Administrator
    $result = schtasks /Create `
        /TN  $taskName `
        /TR  "`"$batFile`"" `
        /SC  DAILY `
        /ST  $startTime `
        /RL  HIGHEST `
        /F

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Registered: $taskName at $startTime daily"
    } else {
        # Try without /RL HIGHEST (non-elevated session)
        $result = schtasks /Create `
            /TN  $taskName `
            /TR  "`"$batFile`"" `
            /SC  DAILY `
            /ST  $startTime `
            /F
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Registered (standard): $taskName at $startTime daily"
        } else {
            Write-Warning "Failed to register: $taskName"
        }
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Task Schedule Summary:"
Write-Host "  08:00  ConduitScore-Health  (site health check)"
Write-Host "  09:00  ConduitScore-Batch1  (dirs 1 of 6)"
Write-Host "  10:30  ConduitScore-Batch2  (dirs 2 of 6)"
Write-Host "  12:00  ConduitScore-Batch3  (dirs 3 of 6)"
Write-Host "  13:30  ConduitScore-Batch4  (dirs 4 of 6)"
Write-Host "  15:00  ConduitScore-Batch5  (dirs 5 of 6)"
Write-Host "  16:30  ConduitScore-Batch6  (dirs 6 of 6)"
Write-Host "========================================"
Write-Host ""
Write-Host "Verify with:"
Write-Host "  schtasks /Query /FO LIST /TN ConduitScore-Batch1"
Write-Host ""
Write-Host "Logs:    $scripts\logs\"
Write-Host "Results: $scripts\results\"
Write-Host ""
Write-Host "DONE."
