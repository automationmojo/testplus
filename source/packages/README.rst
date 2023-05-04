
NOTE: You should not put a '__init__.py' file in this folder.  The sub folders
of this folder are the root of your packages.

.. code::

    packages/org
    packages/blah

So when you import with python from these packages, you would import like:

.. code::

    import org
    import blah

You may have a deep package so import with full names if so.

.. code::
    
    from org.something import Thing

