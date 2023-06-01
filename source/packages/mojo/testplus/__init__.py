
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

from .markers import (
    mark_categories,
    mark_keywords,
    mark_priority,
    mark_descendent_categories,
    mark_descendent_keywords,
    mark_descendent_priority
)

from .parameters import (
    originate_parameter,
    param
)


from .resources import (
    integration,
    resource,
    scope
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
    skip_test
]
