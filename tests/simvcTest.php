<?php

class SimvcTest extends PHPUnit_Framework_TestCase
{
    var $simvc;

    function setUp()
    {
        require_once "../simvc/simvc.php";
        $this->simvc = new Simvc();
    }

    function tearDown()
    {
        unset($this->simvc);
    }


    public function testDynomagicOutput()
    {
        $var = array('field1'=>'value1', 'field2'=>'value2');
        $result = $this->simvc->dynomagicOutput($var, null, false);
        $this->assertEquals($result, '{"field1":"value1","field2":"value2"}');
    }

    /**
     * @dataProvider varProvider
     */
    public function testData($data)
    {
        $this->simvc->data("myVar", $data);
        $result = $this->simvc->data("myVar");
        $this->assertEquals($result, $data);
    }

    public function varProvider()
    {
        return array(
            array("testData"),
            array(123)
        );
    }

    /**
     * @dataProvider varProvider
     */
    public function testSession($data)
    {
        $this->simvc->session("myVar", $data);
        $result = $this->simvc->session("myVar");
        $this->assertEquals($result, $data);
        $this->simvc->session("myVar", null, true);
        $result = $this->simvc->session("myVar");
        $this->assertEquals($result, null);
    }

    public function testAddStyle()
    {
        $this->simvc->addStyle("test-style.css", true);
        $result = $this->simvc->styles();
        $this->assertRegExp("/test-style.css\\?\\d+/im", $result);
        $this->simvc->addStyle("test-style2.css", false);
        $result = $this->simvc->styles();
        $this->assertRegExp("/test-style2.css[^0-9?]/im", $result);
    }

    public function testAddScript()
    {
        $this->simvc->addScript("test-script.js", true);
        $result = $this->simvc->scripts();
        $this->assertRegExp("/test-script.js\\?\\d+/im", $result);
        $this->simvc->addScript("test-script2.js", false);
        $result = $this->simvc->scripts();
        $this->assertRegExp("/test-script2.js[^0-9?]/im", $result);
    }

}