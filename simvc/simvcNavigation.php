<?php
/*
 * Simvc PHP Framework
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/simvcframework/
 *
 */


class SimvcNavigation
{
    public $simvc = null;

    function  __construct($simvc)
    {
        $this->simvc = $simvc;
    }

    public function getItems($withoutIndex)
    {
        $navigation = array();
        $rt = $this->simvc->routeTable;
        foreach ($rt as $route)
        {
            if (!(($route['route'] == "/") && ($withoutIndex)))
            {
                if ($route['method'] == "GET")
                {
                    if ($route['text'] != "")
                    {
                        if ($route['pos'] === null)
                        {
                            $index = PHP_INT_MAX;
                        }
                        else
                        {
                            $index = $route['pos'];
                        }
                        $navigation[$index] = array('uri' => $route['route'], 'title' => $route['text'], 'text' => $route['route']);
                    }
                }
            }
        }
        ksort($navigation);
        return $navigation;
    }
}
