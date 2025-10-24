<!DOCTYPE html>
<html lang="cs">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title inertia>{{ config('app.name', 'vilt-starter-kit') }}</title>
    <meta name="description" content="Vilt Starter Kit - Laravel, Inertia.js, Vue 3, Tailwind CSS, Vite" inertia />
    <meta name="author" content="Braincode s.r.o.">
    @routes
    @vite(['resources/js/app.js', "resources/js/pages/{$page['component']}.vue"])
    @inertiaHead
</head>

<body class="font-sans antialiased h-screen overflow-hidden">
    @inertia
</body>

</html>
