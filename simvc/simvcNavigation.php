<?php
/*
 * Simvc PHP Framework
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/simvc/
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
                        $navigation[] = array('uri' => $route['route'], 'title' => $route['text'], 'text' => $route['route']);
                    }
                }
            }
        }
        return $navigation;
    }
}
