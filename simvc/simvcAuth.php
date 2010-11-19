<?php
/*
 * Simvc PHP Framework
 * Copyright 2010, Eugene Maslovich
 * ehpc@yandex.ru
 * http://ehpc.org.ru/simvcframework/
 *
 */


// Authentication mechanism
class SimvcAuth
{
    public $simvc = null;
    public $dbTable = "simvcauth";
    public $dbFieldLogin = "login";
    public $dbFieldPassword = "password";
    public $dbFieldGroup = "group";

    function  __construct($simvc)
    {
        $this->simvc = $simvc;
    }

    // Check if current login belongs to group
    function inGroup($group)
    {
        $login = $this->getLogin();
        if ($login !== null)
        {
            $row = reset($this->simvc->model->getRows($this->dbTable,  $this->dbFieldLogin." = '".$login."'"));
            if (empty($row))
            {
                return false;
            }
            else
            {
                $fieldGroup = $this->dbFieldGroup;
                if ($row->$fieldGroup == $group)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
        else
        {
            return false;
        }
    }

    // Get current login
    function getLogin()
    {
        return $this->simvc->session("simvcAuthLogin");
    }

    // Hash function for password encryption
    private function hashFunction($password, $login)
    {
        $token = "simvc_token";
        return md5(md5(md5($password).$token).$login);
    }

    // Login with given credentials
    function tryLogin($login, $password)
    {
        $row = reset($this->simvc->model->getRows($this->dbTable,  " ".$this->dbFieldLogin." = '".$login."' "));
        if (empty($row))
        {
            return false;
        }
        else
        {
            $hash = $this->hashFunction($password, $login);
            $fieldPassword = $this->dbFieldPassword;
            if ($row->$fieldPassword == $hash)
            {
                $this->simvc->session("simvcAuthLogin", $login);
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    // Logout
    function logout()
    {
        $this->simvc->session("simvcAuthLogin", null, true);
    }

    // Add new user to database
    public function addUser($login, $password, $group)
    {
        $data = new stdClass();
        $fieldLogin = $this->dbFieldLogin;
        $fieldPassword = $this->dbFieldPassword;
        $fieldGroup = $this->dbFieldGroup;
        $data->$fieldLogin = $login;
        $data->$fieldPassword = $this->hashFunction($password, $login);
        $data->$fieldGroup = $group;
        $this->simvc->model->addRow($this->dbTable, $data);
    }
}
