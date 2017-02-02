
from os.path import exists, join

from pypairtree.utils import identifier_to_path
from pypremis.lib import PremisRecord
from pypremis.nodes import Rights, RightsExtension
from uchicagoldrtoolsuite.bit_level.lib.misc.premisextensionnodes import Restriction,\
    RestrictedObjectIdentifier, RightsExtensionIdentifier

def new_rights_extension(extension_id, restricted_object_id, restriction_code,
                         restriction_active, restriction_comment):
    """a function to generate a rightsExtension element with minimally required data points

    __Args__
    1. extension_id (str): the identifier for the rightsExtension element being created
    2. restricted_object_id (str): the identifier of the object that this rightsExtension describes
    3. restriction_code (str): a SPCL restriction code
    4. restriction_active (str): True or False, a statement about whether the
                                 restriction should be considered active or not
    5. restriction_comment (str): an optional string describing what this restriction is about
    """
    print(restriction_code)
    rights_ext_id = RightsExtensionIdentifier("DOI", extension_id)
    restricted_object = RestrictedObjectIdentifier("DOI", restricted_object_id)
    restrict = Restriction(restriction_code, restriction_active, restricted_object)
    if restriction_comment:
        restrict.set_restrictionReason(restriction_comment.strip())
    rights_extension = RightsExtension()
    rights_extension.set_field("rightsExtensionIdentifier", rights_ext_id)
    rights_extension.set_field("restriction", restrict)
    return rights_extension

def get_ldr_object_filepath(accessionid, objid, root_path):
    """a function to return a valid path to a ldr premis live PREMIS record
    """
    accession_path = str(identifier_to_path(accessionid))
    objid_path = str(identifier_to_path(objid))
    path_to = join(root_path, accession_path,
                   "arf/pairtree_root", objid_path, "arf", "premis.xml")
    return path_to

def get_premis_record(file_path):
    """a function to return a PremisRecord object from a path to a record
    """
    try:
        record = PremisRecord(frompath=file_path)
    except Exception:
        raise Exception()
    return record

def extract_record_rights(a_record):
    """a function retrieve the rights information from a particular PREMIS record
    """
    current_restrictions = []
    current_rights = a_record.get_rights_list()
    for right in current_rights:
        extensions = right.get_rightsExtension()
        for extension in extensions:
            restriction = extension.get_field("restriction")
            code = restriction[0].get_field("restrictionCode")
            active = restriction[0].get_field("active")
            active = active[0] if len(active) == 1 else None
            code = code[0] if len(code) == 1 else None
            if active == "True" and code is not None:
                current_restrictions.append(code)
    return current_restrictions

def wrap_rightsExtensions(group_of_rights_extensions):
    """a function to wrap a bunch of rights extension elements in a PREMIS rights element
    """
    return Rights(rightsExtension=group_of_rights_extensions)

def deactivate_group_of_rights_extensions(a_record):
    old_rights = a_record.get_rights_list()
    output = []
    for right in old_rights:
        extensions = right.get_rightsExtension()
        for extension in extensions:
            new = deactivate_a_right_extension(extension)
            output.append(new)
    return output

def deactivate_a_right_extension(an_extension):
    extension_id = an_extension.get_field("rightsExtensionIdentifier")[0].\
        get_field("rightsExtensionIdentifierValue")
    restriction = an_extension.get_field("restriction")[0]
    code = restriction.get_field("restrictionCode")[0]
    restricted_object_id = restriction.get_field("restrictedObjectIdentifier")[0].\
        get_field("restrictedObjectIdentifierValue")
    try:
        comment = restriction.get_field("restrictionComment")
    except KeyError:
        comment = None
    return new_rights_extension(extension_id, restricted_object_id, code, False, comment)
