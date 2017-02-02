from setuptools import setup

setup(
    name="ldrwebsite",
    description="A RESTful API for creating and manipulating HierarchicalRecords.",
    version="0.0.1dev",
    author="Brian Balsamo, Tyler Danstrom",
    author_email="balsamo@uchicago.edu, tdanstrom@uchicago.edu",
    packages=["ldrwebsite"],
    exclude=[
        "build",
        "bin",
        "dist",
        "tests",
        "ldrwebsite.egg-info"
    ],
#    dependency_links=[
#         "https://github.com/uchicago-library/uchicagldrapi_core" +
#         "/tarball/master#egg=uchicagoldrapicore",
#         "https://github.com/uchicago-library/uchicagoldr-hierarchicalrecords" +
#         "/tarball/master#egg=hierarchicalrecord"
#     ],
    install_requires=[
        "uchicagoldrapicore",
        "hierarchicalrecord"
    ]
)
