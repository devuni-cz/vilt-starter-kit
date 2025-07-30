<?php

declare(strict_types=1);

?>
<!DOCTYPE html>
<html lang="cs">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title inertia>{{ config('app.name', 'vilt-starter-kit') }}</title>
    @routes
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
<?php
