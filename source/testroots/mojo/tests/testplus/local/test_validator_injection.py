
from typing import Dict, Optional


import mojo.testplus as testplus


from mojo.testplus.validation import Validator


class TestValidator(Validator):

    def __init__(self):
        super().__init__()
        return

    def validate(self):
        self._logger.info("Validate called ...")
        return



@testplus.validator()
def create_validator() -> TestValidator:

    validator = TestValidator()
    validator.initialize()

    return validator



@testplus.validate(create_validator, suffix="vcheck", identifier="testval")
def test_no_parameters():
    testplus.logger.info("test_no_parameters: was run.")
    return


if __name__ == "__main__":
    from mojo.testplus.entrypoints import generic_test_entrypoint
    generic_test_entrypoint()
