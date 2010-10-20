<?php

class Index extends SimvcController
{
    public function show()
    {
        $this->simvc->pageTitle = "";
        $this->simvc->template('index.html');
    }
}

