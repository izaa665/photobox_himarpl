<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $photos = $data['photos'] ?? [];
    $allPhotos = $data['allPhotos'] ?? [];
    $finalPhoto = $data['finalPhoto'] ?? '';
    $layout = $data['layout'] ?? '';
    $frame = $data['frame'] ?? '';
    
    if (empty($photos)) {
        echo json_encode(['success' => false, 'message' => 'Foto tidak valid']);
        exit;
    }
    
    // Generate unique session ID
    $sessionId = uniqid('photo_', true);
    
    // Create directory for this session
    $sessionDir = 'photos/' . $sessionId;
    if (!file_exists('photos')) {
        mkdir('photos', 0777, true);
    }
    if (!file_exists($sessionDir)) {
        mkdir($sessionDir, 0777, true);
    }
    
    // Save photos (selected/adjusted photos for layout)
    $savedPhotos = [];
    foreach ($photos as $index => $photoData) {
        if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $matches)) {
            $extension = $matches[1];
            $photoData = substr($photoData, strpos($photoData, ',') + 1);
            $photoData = base64_decode($photoData);
            
            $filename = $sessionDir . '/photo_' . ($index + 1) . '.' . $extension;
            file_put_contents($filename, $photoData);
            $savedPhotos[] = 'photo_' . ($index + 1) . '.' . $extension;
        }
    }
    
    // Save all captured photos (for download)
    $savedAllPhotos = [];
    foreach ($allPhotos as $index => $photoData) {
        if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $matches)) {
            $extension = $matches[1];
            $photoData = substr($photoData, strpos($photoData, ',') + 1);
            $photoData = base64_decode($photoData);
            
            $filename = $sessionDir . '/all_photo_' . ($index + 1) . '.' . $extension;
            file_put_contents($filename, $photoData);
            $savedAllPhotos[] = 'all_photo_' . ($index + 1) . '.' . $extension;
        }
    }
    
    // Save final composed photo
    $finalPhotoFilename = '';
    if (!empty($finalPhoto) && preg_match('/^data:image\/(\w+);base64,/', $finalPhoto, $matches)) {
        $extension = $matches[1];
        $finalPhotoData = substr($finalPhoto, strpos($finalPhoto, ',') + 1);
        $finalPhotoData = base64_decode($finalPhotoData);
        
        $finalPhotoFilename = $sessionDir . '/final_composed.' . $extension;
        file_put_contents($finalPhotoFilename, $finalPhotoData);
    }
    
    // Save metadata
    $metadata = [
        'sessionId' => $sessionId,
        'layout' => $layout,
        'frame' => $frame,
        'photos' => $savedPhotos,
        'allPhotos' => $savedAllPhotos,
        'finalPhoto' => $finalPhotoFilename ? basename($finalPhotoFilename) : '',
        'createdAt' => date('Y-m-d H:i:s')
    ];
    
    file_put_contents($sessionDir . '/metadata.json', json_encode($metadata));
    
    echo json_encode([
        'success' => true, 
        'sessionId' => $sessionId,
        'message' => 'Foto berhasil disimpan'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Method tidak valid']);
}
?>
