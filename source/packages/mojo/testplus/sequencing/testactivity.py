
__author__ = "Myron Walker"
__copyright__ = "Copyright 2020, Myron W Walker"
__credits__ = []


from typing import Optional, Type

import json

from datetime import datetime

from mojo.xmods.xdatetime import format_datetime_with_fractional
from mojo.xmods.jsos import CHAR_RECORD_SEPERATOR

from types import TracebackType

class TestActivity:

    def __init__(self, activity_filename: str, activity_name: str, target: str, detail: Optional[dict]):
        self._activity_filename = activity_filename
        self._activity_name = activity_name
        self._target = target
        self._detail = detail

        self._begin = datetime.now()
        self._end = None
        return
    
    def __enter__(self):
        return self
    
    def __exit__(self, ex_type: Type, ex_inst: BaseException, ex_tb: TracebackType) -> bool:
        self.finalize()
        return False

    @property
    def activity_name(self) -> str:
        return self._activity_name
    
    @property
    def begin(self) -> str:
        return self._begin
    
    @property
    def detail(self) -> str:
        return self._detail
    
    @property
    def end(self) -> str:
        return self._end
    
    @property
    def target(self) -> str:
        return self._target
    
    def as_dict(self):
        """
            Convert the TestActivity object to a dictionary.
        """

        dobj = {
            "activity-name": self._activity_name,
            "detail": self._detail,
            "target": self._target,
            "begin": self._begin,
            "end": self._end
        }
        
        return dobj
    
    def as_json(self, indent=4):
        """
            Convert the TestActivity object to json.
        """
        
        dobj = self.as_dict()

        dobj["begin"] = format_datetime_with_fractional(dobj["begin"])
        if dobj["end"] is not None:
            dobj["end"] = format_datetime_with_fractional(dobj["end"])
        
        content = json.dumps(dobj, indent=indent)

        return content
    
    def finalize(self):
        """
            Finalize the activity.
        """
        
        self._end = datetime.now()

        content = self.as_json()
        with open(self._activity_filename, 'a+') as af:
            af.write(CHAR_RECORD_SEPERATOR)
            af.write(content)
        
        return