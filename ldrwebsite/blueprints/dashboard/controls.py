from collections import namedtuple
from os.path import join, isdir, sep
from os import listdir
from json import load
from sys import stderr

from pypairtree.utils import identifier_to_path

class SummarizeState(object):
    """a class
    """
    def __init__(self, ltsp, sp, invp):
        self.staged = self._find_stages(sp)
        self.inventoried = self._find_inventoried(invp)
        self.non_inventoried = [x.split(ltsp)[1].replace(sep, "")  for x in \
            self._find_difference(self._find_archives(ltsp),
                                  self._find_inventoried(invp))]

    def _find_stages(self, stage_path):
        output = []
        for n_stage in listdir(stage_path):
            output.append(n_stage)
        return output

    def _find_archives(self, lts):
        generated = self._make_a_generator_with_breaks(lts, condition=lambda x: x.endswith("arf"))
        return [x for x in generated]

    def _find_inventoried(self, invp):
        completed_inventory_file = join(invp, "completed.json")
        completd_json_data = load(open(completed_inventory_file, "r"))
        return [x for x in completd_json_data]

    def _find_difference(self, big_list, small_list):
        return [x for x in big_list if x not in small_list]

    def _make_a_generator(self, a_path, condition=lambda x: x is x):
        for n_thing in listdir(a_path):
            cur_path = join(a_path, n_thing)
            if condition(cur_path):
                yield cur_path

    def _make_a_generator_with_breaks(self, a_path, condition=lambda x: x is x):
        for n_thing in listdir(a_path):
            cur_path = join(a_path, n_thing)
            if isdir(cur_path):
                if condition(cur_path):
                    yield cur_path
                    break
                yield from self._make_a_generator_with_breaks(cur_path, condition=condition)


class SummarizeAccession(object):
    """a class
    """
    def __init__(self, lts_path, id):
        path = join(lts_path, str(identifier_to_path(id)),
                    "arf", "admin", "accession_records")
        records = [join(path, x) for x in listdir(path)]
        self.records = self._read_accession_records(records)

    def _read_accession_records(self, list_of_records):
        output = []
        for n_record in list_of_records:
            record_contents = self._read_accession_record(n_record)
            output.append(record_contents)
        return output

    def _read_accession_record(self, a_record_path):
        opened_record = open(a_record_path, "r")
        contents = opened_record.read()
        opened_record.close()
        return contents

class InventorySummarizer(object):
    """a class
    """
    def __init__(self, inv_path, a_id):
        index_file_path = join(inv_path, a_id, "index.json")
        opened_file = open(index_file_path, "r")
        data = load(opened_file)
        opened_file.close()
        self.numfiles = data["numfiles"]
        self.pages = [namedtuple("pagerec", "page numfiles")(v["pagenum"], v["numfiles"])\
                      for x, v in data["pages"].items()]

    def _find_pages(self, inv_path, a_id):
        specific_inventory = join(inv_path, a_id)
        pages = [x.split('.json') for x in listdir(specific_inventory) if 'index' not in x]
        return pages

    def _find_total_files(self, inv_path, a_id):
        index_file_path = join(inv_path, a_id, "index.json")
        stderr.write("{}\n".format(index_file_path))
        opened_file = open(index_file_path, "r")
        data = load(opened_file)
        file_count = data["numfiles"]
        return file_count
