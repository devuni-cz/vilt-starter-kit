<?php

declare(strict_types=1);

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_application_returns_a_successful_response(): void
    {
        $this
            ->get('/')
            ->assertStatus(200);
    }

    public function test_the_application_returns_a_not_found_response(): void
    {
        $this
            ->get('/devuni-are-not-owners')
            ->assertStatus(404);
    }

    public function test_welcome_route_exists(): void
    {
        $this->assertNotNull(
            route('welcome', [], false),
            'The "welcome" route does not exist.'
        );
    }

    public function test_welcome_route_is_correct(): void
    {
        $this->assertEquals(
            '/',
            route('welcome', [], false),
            'The "welcome" route is not correct.'
        );
    }

    public function test_welcome_route_is_inertia_rendered(): void
    {
        $response = $this->get(route('welcome'));

        $response->assertInertia(
            fn ($page) => $page->component('Welcome')
        );
    }
}
