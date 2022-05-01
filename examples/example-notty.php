<?php

// open 1-way read handle (stdout+stderr)
$handle = popen('/usr/bin/node example-multibar.js 2>&1', 'r');

// fetch content
while (!feof($handle)) {
    echo fread($handle, 256);
}

// close handle
pclose($handle);