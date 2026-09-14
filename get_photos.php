<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Content-Type: application/json');

$sessionId = $_GET['session'] ?? '';

if (empty($sessionId)) {
    echo json_encode(['success' => false, 'message' => 'Session ID tidak valid']);
    exit;
}

$sessionDir = 'photos/' . $sessionId;

if (!file_exists($sessionDir)) {
    echo json_encode(['success' => false, 'message' => 'Sesi tidak ditemukan']);
    exit;
}

$metadataFile = $sessionDir . '/metadata.json';
if (!file_exists($metadataFile)) {
    echo json_encode(['success' => false, 'message' => 'Metadata tidak ditemukan']);
    exit;
}

$metadata = json_decode(file_get_contents($metadataFile), true);

echo json_encode([
    'success' => true,
    'sessionId' => $sessionId,
    'layout' => $metadata['layout'],
    'frame' => $metadata['frame'],
    'photos' => $metadata['photos'],
    'allPhotos' => $metadata['allPhotos'] ?? [],
    'finalPhoto' => $metadata['finalPhoto'] ?? '',
    'createdAt' => $metadata['createdAt']
]);
?>
