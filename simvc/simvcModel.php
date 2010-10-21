<?php
/*
 * Simvc PHP Framework
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/simvcframework/
 *
 */


class SimvcModel
{
    public $simvc = null;
    public $dsn = "";
    public $user = "";
    public $password = "";

    function  __construct($simvc, $modelDsn, $modelUser, $modelPassword)
    {
        $this->simvc = $simvc;
        $this->dsn = $modelDsn;
        $this->user = $modelUser;
        $this->password = $modelPassword;

        require "rb.php";
        if ($this->user == "")
        {
            R::setup($this->dsn);
        }
        else
        {
            R::setup($this->dsn, $this->user, $this->password);
        }
    }

    public function getRow($table, $id)
    {
        $row = R::load($table, $id);
        return $row;
    }

    public function getRows($table, $filter)
    {
        $rows = Finder::where($table, $filter);
        return $rows;
    }

    public function updateRow($table, $dataWithId, $autoFill = false)
    {
        $row = R::load($table, $dataWithId->id);
        foreach ($row as $key => $value)
        {
            if (isset($dataWithId->$key))
            {
                if ($key != "id")
                {
                    if ($autoFill)
                    {
                        if ($key == "lastUpdate")
                        {
                            $dataWithId->$key = date("c");
                        }
                    }
                    $row->$key =  $dataWithId->$key;
                }
            }
        }
        R::store($row);
        return $row;
    }

    public function addRow($table, $data)
    {
        $row = R::dispense($table);
        foreach ($data as $key => $value)
        {
            $row->$key =  $data->$key;
        }
        R::store($row);
        return $row;
    }
}
