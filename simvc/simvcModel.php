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

        // Init Redbean
        require "rb12lg.php";
        if ($this->user == "")
        {
            R::setup($this->dsn);
        }
        else
        {
            R::setup($this->dsn, $this->user, $this->password);
        }
    }

    // Get row from table by id
    public function getRow($table, $id)
    {
        $row = R::load($table, $id);
        return $row;
    }

    // Get rows based on filtering expression
    public function getRows($table, $filter)
    {
        $rows = Finder::where($table, $filter);
        return $rows;
    }

    // Change row data
    // data should be of specific format
    public function updateRow($table, $dataWithId, $autoFill = false)
    {
        $row = R::load($table, $dataWithId->id);
        foreach ($row as $key => $value)
        {
            if (isset($dataWithId->$key))
            {
                if ($key != "id")
                {
                    // We can automatically fill some fields
                    if ($autoFill)
                    {
                        // For example this last update field
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

    // Add row to table
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
