
__author__ = "Myron Walker"
__copyright__ = "Copyright 2023, Myron W Walker"
__credits__ = []
__version__ = "1.0.0"
__maintainer__ = "Myron Walker"
__email__ = "myron.walker@gmail.com"
__status__ = "Development" # Prototype, Development or Production
__license__ = "MIT"

import logging

from .exceptions import skip_test

from mojo.xmods.markers import (
    mark_categories,
    mark_keywords,
    mark_priority,
    mark_descendent_categories,
    mark_descendent_keywords,
    mark_descendent_priority
)

from mojo.xmods.injection.constraints import (
    Constraints,
    FeatureConstraints
)

from mojo.xmods.injection.constraintscatalog import ConstraintsCatalog

from mojo.xmods.injection.origination import (
    originate_parameter
)

from mojo.xmods.injection.decorators.factory import (
    integration,
    resource,
    scope,
    validator
)

from mojo.xmods.injection.decorators.injection import (
    param,
    validate
)

from .verification import (
    assert_dict_response_has_keys,
    assert_dict_response_has_paths,
    assert_equal,
    assert_expression,
    assert_greater,
    assert_lessthan,
    assert_list_length,
    assert_list_length_greater,
    assert_not_equal,
    assert_type
)

logger = logging.getLogger()

__all__ = [
    assert_dict_response_has_keys,
    assert_dict_response_has_paths,
    assert_equal,
    assert_expression,
    assert_greater,
    assert_lessthan,
    assert_list_length,
    assert_list_length_greater,
    assert_not_equal,
    assert_type,
    integration,
    logger,
    mark_categories,
    mark_keywords,
    mark_priority,
    mark_descendent_categories,
    mark_descendent_keywords,
    mark_descendent_priority,
    originate_parameter,
    param,
    resource,
    scope,
    skip_test,
    validate,
    validator,
    Constraints,
    ConstraintsCatalog,
    FeatureConstraints
]

try:
    from mojo.results.model.taskingresult import verify_tasking_results

    __all__.append(verify_tasking_results)

except ImportError:
    pass
