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
    private $navItems = array();

    function  __construct($simvc)
    {
        $this->simvc = $simvc;
    }

    public function addItem($uri, $label, $description, $priority)
    {
        $this->navItems[] = (object)array('uri' => $uri, 'label' => $label, 'description' => $description, 'priority' => $priority);
    }


    public function getItems($withoutIndex = false)
    {
        $res = $this->navItems;
        if ($withoutIndex)
        {
            foreach ($res as $key => $value)
            {
                if ($res[$key]->uri == '/')
                {
                    unset($res[$key]);
                }
            }
        }
        foreach ($res as $key => $row)
        {
            $arr[$key]  = $row->priority;
        }
        array_multisort($arr, SORT_ASC, $res);

        return $res;
    }
}
