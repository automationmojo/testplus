

from typing import Generator, List

import os
import time

from mojo import testplus

from mojo.xmods.landscaping.landscape import Landscape
from mojo.xmods.landscaping.includefilters import IncludeDeviceByDeviceType

from mojo.interop.protocols.tasker.examples.helloworldtasking import HelloWorldTasking

from mojo.interop.clients.linux.linuxclient import LinuxClient
from mojo.interop.protocols.tasker.taskingresult import TaskingResult, TaskingResultPromise
from mojo.interop.protocols.tasker.taskercontroller import ClientTaskerController


@testplus.resource()
def tasker_network_controller(lscape: Landscape, constraints={}) -> Generator[LinuxClient, None, None]:
    
    includes = [IncludeDeviceByDeviceType("network/client-linux")]

    client_list = lscape.get_devices(include_filters=includes)

    tcontroller = ClientTaskerController()

    tcontroller.start_tasker_network(client_list)

    yield tcontroller


@testplus.param(tasker_network_controller, identifier="tcontroller")
def test_tasker_say_hello(tcontroller: ClientTaskerController):

    promises: List[TaskingResultPromise] =  tcontroller.execute_tasking_on_all_nodes(tasking=HelloWorldTasking, message="Hello World")

    results: List[TaskingResult] = tcontroller.wait_for_tasking_results(promises)
    testplus.assert_tasking_results(results, "The specified taskings did not complete successfully.")

    return
