<?php
/*
 * Simvc PHP Framework
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/simvcframework/
 *
 */


// Base class for Simvc controller mechanism
class SimvcController
{
    public $controllerPath = null;
    public $simvc = null;

    function  __construct($simvc)
    {
        $this->simvc = $simvc;
    }
}