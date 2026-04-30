$urls = @('http://127.0.0.1:3000/', 'http://127.0.0.1:3000/dev.html', 'http://127.0.0.1:3000/index.html')
foreach ($url in $urls) {
    Write-Host "`n=== 测试: $url ==="
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10
        Write-Host "状态码: $($response.StatusCode)"
        Write-Host "Content-Type: $($response.Headers['Content-Type'])"
        Write-Host "Content-Disposition: $($response.Headers['Content-Disposition'])"
        $contentBytes = $response.Content
        $preview = if ($contentBytes -is [byte[]]) {
            $encoding = [System.Text.Encoding]::UTF8
            $text = $encoding.GetString($contentBytes)
            if ($text.Length -gt 200) { $text.Substring(0,200) } else { $text }
        } else {
            $content = $contentBytes.ToString()
            if ($content.Length -gt 200) { $content.Substring(0,200) } else { $content }
        }
        Write-Host "前200字节: $preview"
        $isHtml = $preview.StartsWith('<!DOCTYPE html>') -or $preview.StartsWith('<html') -or $response.Headers['Content-Type'] -like '*html*'
        Write-Host "是否为HTML: $isHtml"
        Write-Host "所有响应头:"
        $response.Headers.GetEnumerator() | ForEach-Object { Write-Host "  $($_.Key): $($_.Value)" }
    } catch {
        Write-Host "错误: $_"
    }
}
