<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $email = $data['email'] ?? '';
    $photos = $data['photos'] ?? [];
    $layout = $data['layout'] ?? '';
    $frame = $data['frame'] ?? '';
    
    if (empty($email) || empty($photos)) {
        echo json_encode(['success' => false, 'message' => 'Email atau foto tidak valid']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Format email tidak valid']);
        exit;
    }
    
    // Create temporary directory for photos
    $tempDir = 'temp_photos_' . time();
    if (!file_exists($tempDir)) {
        mkdir($tempDir, 0777, true);
    }
    
    // Save photos to temporary directory
    $photoFiles = [];
    foreach ($photos as $index => $photoData) {
        // Remove data URI prefix if present
        if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $matches)) {
            $extension = $matches[1];
            $photoData = substr($photoData, strpos($photoData, ',') + 1);
            $photoData = base64_decode($photoData);
            
            $filename = $tempDir . '/photo_' . ($index + 1) . '.' . $extension;
            file_put_contents($filename, $photoData);
            $photoFiles[] = $filename;
        }
    }
    
    // Email settings - UPDATE THESE WITH YOUR SMTP SETTINGS
    $smtpHost = 'smtp.gmail.com';
    $smtpPort = 587;
    $smtpUsername = 'DinoExposition@gmail.com'; // Ganti dengan email kamu
    $smtpPassword = 'rtoo zcqs edbg usgw'; // Ganti dengan App Password Gmail
    $fromEmail = 'DinoExposition@gmail.com'; // Ganti dengan email kamu
    $fromName = 'Photobox Fun';
    
    // Try to use PHPMailer if available
    $phpmailerPath = __DIR__ . '/PHPMailer/src/PHPMailer.php';
    $phpmailerExceptionPath = __DIR__ . '/PHPMailer/src/Exception.php';
    $phpmailerSMTPPath = __DIR__ . '/PHPMailer/src/SMTP.php';
    
    if (file_exists($phpmailerPath) && file_exists($phpmailerExceptionPath) && file_exists($phpmailerSMTPPath)) {
        require $phpmailerPath;
        require $phpmailerExceptionPath;
        require $phpmailerSMTPPath;
        
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            
            // Server settings
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUsername;
            $mail->Password = $smtpPassword;
            $mail->SMTPSecure = PHPMailer\PHPMailer\ENCRYPTION_STARTTLS;
            $mail->Port = $smtpPort;
            
            // Recipients
            $mail->setFrom($fromEmail, $fromName);
            $mail->addAddress($email);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Hasil Foto Photobox Anda';
            $mail->Body = "
            <html>
            <head>
            <title>Hasil Foto Photobox</title>
            </head>
            <body style='font-family: Arial, sans-serif; background-color: #fce7f3; padding: 20px;'>
            <div style='max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);'>
            <div style='text-align: center; margin-bottom: 30px;'>
            <h1 style='color: #ff6b9d; margin: 0;'>📸 Photobox Fun</h1>
            <p style='color: #666; margin: 10px 0 0;'>Hasil foto photobox Anda</p>
            </div>
            
            <div style='background-color: #fff5f8; padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
            <p style='margin: 0; color: #333;'><strong>Layout:</strong> $layout</p>
            <p style='margin: 10px 0 0; color: #333;'><strong>Frame:</strong> $frame</p>
            <p style='margin: 10px 0 0; color: #333;'><strong>Jumlah Foto:</strong> " . count($photos) . "</p>
            </div>
            
            <p style='color: #666; line-height: 1.6;'>
            Terima kasih telah menggunakan Photobox Fun! Foto-foto Anda terlampir dalam email ini.
            </p>
            
            <div style='text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;'>
            <p style='color: #999; font-size: 12px; margin: 0;'>© 2026 Photobox Fun. All rights reserved.</p>
            </div>
            </div>
            </body>
            </html>
            ";
            
            // Attachments
            foreach ($photoFiles as $photoFile) {
                if (file_exists($photoFile)) {
                    $mail->addAttachment($photoFile);
                }
            }
            
            $mail->send();
            
            // Clean up
            foreach ($photoFiles as $photoFile) {
                if (file_exists($photoFile)) {
                    unlink($photoFile);
                }
            }
            rmdir($tempDir);
            
            echo json_encode(['success' => true, 'message' => 'Email berhasil dikirim']);
            
        } catch (Exception $e) {
            // Clean up on error
            foreach ($photoFiles as $photoFile) {
                if (file_exists($photoFile)) {
                    unlink($photoFile);
                }
            }
            rmdir($tempDir);
            
            $errorMessage = 'PHPMailer Error: ' . $mail->ErrorInfo;
            error_log($errorMessage);
            echo json_encode(['success' => false, 'message' => $errorMessage]);
        }
    } else {
        // Fallback to built-in mail() function
        $to = $email;
        $subject = 'Hasil Foto Photobox Anda';
        
        $message = "
        <html>
        <head>
        <title>Hasil Foto Photobox</title>
        </head>
        <body style='font-family: Arial, sans-serif; background-color: #fce7f3; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);'>
        <div style='text-align: center; margin-bottom: 30px;'>
        <h1 style='color: #ff6b9d; margin: 0;'>📸 Photobox Fun</h1>
        <p style='color: #666; margin: 10px 0 0;'>Hasil foto photobox Anda</p>
        </div>
        
        <div style='background-color: #fff5f8; padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
        <p style='margin: 0; color: #333;'><strong>Layout:</strong> $layout</p>
        <p style='margin: 10px 0 0; color: #333;'><strong>Frame:</strong> $frame</p>
        <p style='margin: 10px 0 0; color: #333;'><strong>Jumlah Foto:</strong> " . count($photos) . "</p>
        </div>
        
        <p style='color: #666; line-height: 1.6;'>
        Terima kasih telah menggunakan Photobox Fun! Foto-foto Anda terlampir dalam email ini.
        </p>
        
        <div style='text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;'>
        <p style='color: #999; font-size: 12px; margin: 0;'>© 2026 Photobox Fun. All rights reserved.</p>
        </div>
        </div>
        </body>
        </html>
        ";
        
        // Boundary for multipart email
        $boundary = md5(time());
        
        // Headers
        $headers = "From: $fromEmail\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        
        // Email body
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $message . "\r\n";
        
        // Attach photos
        foreach ($photoFiles as $photoFile) {
            if (file_exists($photoFile)) {
                $filename = basename($photoFile);
                $fileSize = filesize($photoFile);
                $handle = fopen($photoFile, "r");
                $content = fread($handle, $fileSize);
                fclose($handle);
                $content = chunk_split(base64_encode($content));
                
                $body .= "--$boundary\r\n";
                $body .= "Content-Type: application/octet-stream; name=\"$filename\"\r\n";
                $body .= "Content-Transfer-Encoding: base64\r\n";
                $body .= "Content-Disposition: attachment; filename=\"$filename\"\r\n\r\n";
                $body .= $content . "\r\n";
            }
        }
        
        $body .= "--$boundary--";
        
        // Send email
        if (mail($to, $subject, $body, $headers)) {
            // Clean up
            foreach ($photoFiles as $photoFile) {
                if (file_exists($photoFile)) {
                    unlink($photoFile);
                }
            }
            rmdir($tempDir);
            
            echo json_encode(['success' => true, 'message' => 'Email berhasil dikirim']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal mengirim email. Perlu konfigurasi SMTP di php.ini']);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak valid']);
}
?>
