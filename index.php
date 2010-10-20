<?php

include "simvc/simvc.php";

$simvc = new Simvc();
$simvc->route('GET', '/', 'Index::show', 'Homepage');

$simvc->run();

