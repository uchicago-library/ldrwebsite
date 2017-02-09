
import re
from mimetypes import guess_extension
from os.path import join, exists
from pypairtree.utils import identifier_to_path

from .pypremis_convenience import *

def make_download_event(path_to_record, event_category, event_date, event_status, user, objid):
    """a functino to create a Premis event node defined with the

    __Args__
    1. path_to_record (str): a path on-disk pointing to a premis record to write to
    2. event_category (str): the category of event that is being written
    3. event_date (str): the date in ISO-8601 that the event was performed
    4. event_status (str): the status, either "SUCCESS" or "FAIL" of the event
    5. user (str): the identifier for the user which performed this event
    6. objid (str): the identifier for the object that this event was performed on
    """
    if re.compile("^a|e|i|o|u.*").match(event_category):
        event_message = "there was an {} of this content".format(event_category)
    else:
        event_message = "there was a {} of this content".format(event_category)
    new_download_event = build_a_premis_event(event_category, event_date, event_status,
                                              event_message, user, objid, agent_type="person")
    was_it_written = add_event_to_premis_record(path_to_record, new_download_event)
    new_download_event = build_a_premis_event(event_category, event_date, event_status,
                                              event_message, user, objid, agent_type="person")
    was_it_written = add_event_to_premis_record(path_to_record, new_download_event)
    return was_it_written

def get_data_half_of_object(arkid, premisid, lp_path):
    """a function to get the metadata required from a given object

    __Args__
    1. arkid (str): a uuid representing a particular accession in the ldr
    2. premisid (str): a uuid representing a particular object in the ldr
    3. lp_path (str): root to live premis environment
    """
    arkid_path = str(identifier_to_path(arkid))
    premisid_path = str(identifier_to_path(premisid))
    path_to_premis = join(lp_path, arkid_path, "arf", "pairtree_root",
                          premisid_path, "arf", "premis.xml")
    if exists(path_to_premis):
        return (path_to_premis, extract_identity_data_from_premis_record(path_to_premis))
    else:
        return None

def get_content_half_of_object(arkid, premisid, lts_path):
    """a function to get the bytestream of a given object

    __Args__
    1. arkid (str): a uuid representing a particular accession in the ldr
    2. premisid (str): a uuid representing a particular object in the ldr
    3. lts (str): root to long term storage environment
    """
    arkid_path = str(identifier_to_path(arkid))
    premisid_path = str(identifier_to_path(premisid))
    path_to_content = join(lts_path, arkid_path, "arf",
                           "pairtree_root", premisid_path,
                           "arf", "content.file")
    if exists(path_to_content):
        return (path_to_content, None)
    else:
        return None

def get_object_halves(arkid, premisid, lts_path, lp_path):
    """a function to get the bytestream of a given object and the metadata about that bytestream

    __Args__
    1. arkid (str): a uuid representing a particular accession in the ldr
    2. premisid (str): a uuid representing a particular object in the ldr
    3. lts (str): root to long term storage environment
    4. lp_path (str): root to live premis environment
    """
    content = get_data_half_of_object(arkid, premisid, lts_path)
    data = get_data_half_of_object(arkid, premisid, lp_path)
    print(content)
    print(data)
    if content and data:
        return (content[0], data[1])
    else:
        return None

def get_an_attachment_filename(data_bit):
    """a function to construct the filename for an attachment sent through the web request

    __Args__
    1. data_bit (namedtuple): a namedtuple with the object identifier for the
                              bytestream being passed as
                              "objid" property and the mimetype of that bytestream passed as the
                              "mimetype" property.
    """
    extension = guess_extension(data_bit.mimetype, strict=False)
    if extension:
        return (str(data_bit.objid + "." + extension), data_bit.mimetype)
    else:
        return (data_bit.objid, "application/octet-stream")
