<?php

include "simvc/simvc.php";

$simvc->route('GET', '/', 'Index::show', 'Homepage');

$simvc->run();

