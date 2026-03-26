<!DOCTYPE html>
<html lang="cs">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Vilt Starter Kit - Laravel, Inertia.js, Vue 3, Tailwind CSS, Vite" data-inertia />
    <meta name="author" content="Braincode s.r.o.">
    @vite(['resources/js/app.js'])
    <x-inertia::head>
        <title>{{ config('app.name', 'Devuni - vilt-starter-kit') }}</title>
    </x-inertia::head>
    <x-inertia::head />
</head>

<body class="font-sans antialiased h-screen overflow-hidden">
    <x-inertia::app />
</body>

</html>
