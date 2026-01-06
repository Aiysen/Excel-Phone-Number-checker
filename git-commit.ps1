# Git commit helper script with proper UTF-8 encoding
# Usage: .\git-commit.ps1 "Commit message"

param(
    [Parameter(Mandatory=$true)]
    [string]$Message
)

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Write message to temp file
$tempFile = [System.IO.Path]::GetTempFileName()
[System.IO.File]::WriteAllText($tempFile, $Message, [System.Text.Encoding]::UTF8)

# Commit using file
git commit -F $tempFile

# Cleanup
Remove-Item $tempFile

