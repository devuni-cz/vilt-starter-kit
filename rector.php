<?php

declare(strict_types=1);

use Rector\Config\RectorConfig;
use Rector\TypeDeclaration\Rector\Class_\ReturnTypeFromStrictTernaryRector;
use Rector\TypeDeclaration\Rector\ClassMethod\AddParamTypeFromPropertyTypeRector;
use Rector\TypeDeclaration\Rector\Closure\AddClosureVoidReturnTypeWhereNoReturnRector;
use Rector\TypeDeclaration\Rector\Closure\ClosureReturnTypeRector;
use Rector\TypeDeclaration\Rector\Property\TypedPropertyFromStrictConstructorRector;
use Rector\TypeDeclaration\Rector\StmtsAwareInterface\DeclareStrictTypesRector;

return RectorConfig::configure()
    ->withPaths([
        __DIR__ . '/app',
        __DIR__ . '/bootstrap',
        __DIR__ . '/config',
        __DIR__ . '/public',
        __DIR__ . '/resources',
        __DIR__ . '/routes',
        __DIR__ . '/tests',
    ])
    ->withRules([
        // Type Declarations
        DeclareStrictTypesRector::class,

        // Functions and Closures
        ReturnTypeFromStrictTernaryRector::class,
        AddClosureVoidReturnTypeWhereNoReturnRector::class,
        ClosureReturnTypeRector::class,
        TypedPropertyFromStrictConstructorRector::class,

        // Function parameters
        AddParamTypeFromPropertyTypeRector::class,
    ])
    ->withPhpSets(php84: true);
