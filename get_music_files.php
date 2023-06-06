<?php
$musicFolder = 'music/';
$musicFiles = glob($musicFolder . '*.mp3');
echo json_encode($musicFiles);
?>
