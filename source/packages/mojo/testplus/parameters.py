__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

from typing import Callable, Dict, Optional

import inspect

from mojo.xmods.exceptions import SemanticError
from mojo.xmods.landscaping.coupling.integrationcoupling import IntegrationCoupling

from mojo.testplus.registration.resourceregistry import resource_registry

from mojo.testplus.registration.integrationsource import IntegrationSource
from mojo.testplus.resourcelifespan import ResourceLifespan
from mojo.testplus.registration.parameterorigin import ParameterOrigin

def param(source, *, identifier: Optional[None], constraints: Optional[Dict]=None):
    def decorator(subscriber: Callable) -> Callable:
        nonlocal source
        nonlocal identifier
        nonlocal constraints

        if identifier is None:
            identifier = source.__name__

        if identifier == 'constraints':
            errmsg = "Invalid identifier.  The word 'constraints' is reseved for delivering dynamic constraints."
            raise SemanticError(errmsg) from None

        life_span = ResourceLifespan.Test

        source_info = resource_registry.lookup_resource_source(source)

        if constraints is not None and 'constraints' not in source_info.source_signature.parameters:
            raise SemanticError("Attempting to pass constraints to a parameter origin with no 'constraints' parameter.") from None

        assigned_scope = "{}#{}".format(subscriber.__module__, subscriber.__name__)

        param_origin = ParameterOrigin(assigned_scope, identifier, source_info, life_span, constraints)
        resource_registry.register_parameter_origin(identifier, param_origin)

        return subscriber
    return decorator

def originate_parameter(source_func, *, identifier: Optional[None], life_span: ResourceLifespan=None, assigned_scope: Optional[str]=None, constraints: Optional[Dict]=None):

    if source_func is None:
        errmsg = "The 'source_func' parameter cannot be 'None'."
        raise SemanticError(errmsg) from None

    if life_span == ResourceLifespan.Test:
        errmsg = "The 'life_span' parameter cannot be 'ResourceLifespan.Test'."
        raise SemanticError(errmsg) from None

    if identifier is None:
        identifier = source_func.__name__

    if identifier == 'constraints':
        errmsg = "Invalid identifier.  The word 'constraints' is reseved for delivering dynamic constraints."
        raise SemanticError(errmsg) from None

    source_info = resource_registry.lookup_resource_source(source_func)
    if assigned_scope is not None:
        if isinstance(source_info, IntegrationSource):
            errmsg = "The 'assigned_scope' parameter should not be specified unless the source of the resource is of type 'scope' or 'resource'."
            raise SemanticError(errmsg) from None

    if constraints is not None and 'constraints' not in source_info.source_signature.parameters:
            raise SemanticError("Attempting to pass constraints to a parameter origin with no 'constraints' parameter.") from None

    caller_frame = inspect.stack()[1]
    calling_module = inspect.getmodule(caller_frame[0])
    
    if life_span is None:
        res_type = source_info.resource_type
        if issubclass(res_type, IntegrationCoupling):
            life_span = ResourceLifespan.Session
        else:
            life_span = ResourceLifespan.Package

    if life_span == ResourceLifespan.Package:
        if assigned_scope is None:
            assigned_scope = calling_module.__name__
    elif life_span == ResourceLifespan.Session:
        assigned_scope = "<session>"

    param_origin = ParameterOrigin(assigned_scope, identifier, source_info, life_span, constraints)
    resource_registry.register_parameter_origin(identifier, param_origin)

    return

