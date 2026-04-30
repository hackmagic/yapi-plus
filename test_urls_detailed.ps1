$urls = @(
    @{ Url = 'http://127.0.0.1:3000/'; Name = '根路径' },
    @{ Url = 'http://127.0.0.1:3000/dev.html'; Name = 'dev.html' },
    @{ Url = 'http://127.0.0.1:3000/index.html'; Name = 'index.html' }
)

foreach ($item in $urls) {
    $url = $item.Url
    $name = $item.Name
    Write-Host "`n=========================================="
    Write-Host "测试: $name ($url)"
    Write-Host "=========================================="
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10

        # 状态码
        Write-Host "`n状态码: $($response.StatusCode)"

        # Content-Type
        $contentType = $response.Headers['Content-Type']
        Write-Host "Content-Type: $contentType"

        # Content-Disposition
        $contentDisposition = $response.Headers['Content-Disposition']
        Write-Host "Content-Disposition: $contentDisposition"

        # 响应内容前200字节
        $contentBytes = $response.Content
        if ($contentBytes -is [byte[]]) {
            $encoding = [System.Text.Encoding]::UTF8
            $text = $encoding.GetString($contentBytes)
        } else {
            $text = $contentBytes.ToString()
        }
        $previewLength = [Math]::Min(200, $text.Length)
        $preview = $text.Substring(0, $previewLength)
        Write-Host "`n响应内容前$previewLength字节:"
        Write-Host $preview
        Write-Host ""

        # 是否为HTML
        $isHtml = $text.TrimStart().StartsWith('<!DOCTYPE html>') -or $text.TrimStart().StartsWith('<html')
        Write-Host "是否为HTML: $isHtml"

        # 额外信息
        Write-Host "`n其他响应头:"
        foreach ($key in $response.Headers.Keys) {
            if ($key -notin @('Content-Type', 'Content-Disposition')) {
                Write-Host "  $key`: $($response.Headers[$key])"
            }
        }

    } catch {
        Write-Host "`n错误: $_"
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode
            Write-Host "状态码: $statusCode"
        }
    }
}
