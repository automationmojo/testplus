
import os

PARENT_DIR = os.path.dirname(__file__)
REPOSITORY_DIR = os.path.abspath(os.path.join(PARENT_DIR, "..", ".."))

from mojo.collections.context import Context
from mojo.collections.contextpaths import ContextPaths

from mojo.config.variables import resolve_configuration_variables
from mojo.config.configurationmaps import resolve_configuration_maps
from mojo.config.optionoverrides import MOJO_CONFIG_OPTION_OVERRIDES

from mojo.xmods.credentials.sshcredential import SshCredential
from mojo.xmods.landscaping.landscapeparameters import LandscapeActivationParams
from mojo.xmods.landscaping.landscape import startup_landscape

from mojo.interop.protocols.ssh.sshagent import SshAgent
from mojo.interop.clients.linux.linuxclient import LinuxClient
from mojo.interop.clients.clientsourcepackager import ClientSourcePackager

def tasker_server_deploy():

    resolve_configuration_variables()

    output_dir = os.path.expanduser("~/mjr/results/examples/landscaping")
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    resolve_configuration_maps(use_credentials=True, use_landscape=True)

    ctx = Context()
    ctx.insert(ContextPaths.OUTPUT_DIRECTORY, output_dir)

    activation_params = LandscapeActivationParams(allow_unknown_devices=True, allow_unknown_services=True)

    lscape = startup_landscape(activation_params=activation_params)

    source_root = REPOSITORY_DIR
    package_name = "mojointerop_package.zip"

    deploy_to = "~/automation"

    all_devices = lscape.get_devices()

    dev: LinuxClient = None

    for dev in all_devices:

        with dev.ssh.open_session() as session:
            print(f"Starting configuration for device ({dev.ipaddr})")

            print(f"Configuring sudo priviledges for device ({dev.ipaddr})")
            dev.configure.enabled_no_password_sudo(sys_context=session)

            print(f"Deploying source package to device ({dev.ipaddr})")
            dev.configure.deploy_source_package(source_root, package_name, deploy_to, sys_context=session)

            print(f"Configuring tasker service on device ({dev.ipaddr})")
            dev.configure.configure_tasker_service(deploy_to, sys_context=session)

            print(f"Finishing configuration for device ({dev.ipaddr})")


    return


if __name__ == "__main__":
    tasker_server_deploy()