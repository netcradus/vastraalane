$ErrorActionPreference = "Stop"

$backendRoot = Split-Path -Parent $PSScriptRoot
Set-Location $backendRoot

$env:MIGRATION_BATCH_SIZE = if ($env:MIGRATION_BATCH_SIZE) { $env:MIGRATION_BATCH_SIZE } else { "100" }
$env:MIGRATION_CONCURRENCY = if ($env:MIGRATION_CONCURRENCY) { $env:MIGRATION_CONCURRENCY } else { "12" }

$logPath = Join-Path $backendRoot "migration-cloudinary.log"
$errPath = Join-Path $backendRoot "migration-cloudinary.err"

"[$(Get-Date -Format o)] Starting Cloudinary migration" | Out-File -FilePath $logPath -Append -Encoding utf8

try {
  node scripts/migrateImagesToCloudinary.js 1>> $logPath 2>> $errPath
  "[$(Get-Date -Format o)] Migration process finished" | Out-File -FilePath $logPath -Append -Encoding utf8
} catch {
  "[$(Get-Date -Format o)] Wrapper failure: $($_.Exception.Message)" | Out-File -FilePath $errPath -Append -Encoding utf8
  throw
}
