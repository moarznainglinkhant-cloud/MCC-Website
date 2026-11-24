# brain-fibres.bin

Used by `js/about-brain.js` (the animated brain behind Tina's profile card on the About page).

About 3,000 white-matter streamlines sampled from the **HCP1065 population-averaged tractography atlas**:
Yeh, F.-C. (2022). Population-based tract-to-region connectome of the human brain and its hierarchical topology.
*Nature Communications* 13, 4933. https://doi.org/10.1038/s41467-022-32595-4

- Source: https://github.com/frankyeh/data-atlas/releases/download/hcp1065/hcp1065_avg_tracts_trk.zip
- Licence: Creative Commons Attribution-ShareAlike 4.0. This file is a derivative and is shared under the same licence.
- Data were provided in part by the Human Connectome Project, WU-Minn Consortium (Principal Investigators: David Van Essen and
  Kamil Ugurbil; 1U54MH091657) funded by the 16 NIH Institutes and Centers that support the NIH Blueprint for Neuroscience
  Research; and by the McDonnell Center for Systems Neuroscience at Washington University.

Rebuild (needs `pip install nibabel numpy`), from the unzipped atlas folder:

    python3 tools/brain-fibres.py hcp1065_avg_tracts_trk data/brain-fibres.bin 3000 21

Arguments: number of streamlines (keep points x streamlines under 65,536) and points per streamline.
