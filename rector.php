<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\CodingStyle\Rector\Enum_\EnumCaseToPascalCaseRector;
use RectorLaravel\Rector\StaticCall\EloquentMagicMethodToQueryBuilderRector;
use Rector\Php83\Rector\ClassMethod\AddOverrideAttributeToOverriddenMethodsRector;

return RectorConfig::configure()
    ->withPaths([
        __DIR__.'/app',
        __DIR__.'/bootstrap/app.php',
        __DIR__.'/database',
        __DIR__.'/public',
        __DIR__.'/routes',
        __DIR__.'/config',
        __DIR__.'/tests',
    ])
    ->withSkip([
        __DIR__.'/bootstrap/cache',
        __DIR__.'/storage',
        __DIR__.'/vendor',
        AddOverrideAttributeToOverriddenMethodsRector::class,
    ])
    ->withPreparedSets(
        deadCode: true,
        codeQuality: true,
        codingStyle: true,
        typeDeclarations: true,
        privatization: true,
        earlyReturn: true,
    )
    ->withRules([
        EnumCaseToPascalCaseRector::class,
    ])
    ->withConfiguredRule(EloquentMagicMethodToQueryBuilderRector::class, [
        'exclude_methods' => [
            'find',
            'findOrFail',
            'first',
            'firstOrFail',
            'get',
            'all',
        ],
    ])
    ->withPhpSets(php84: true);
