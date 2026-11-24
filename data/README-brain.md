# brain-fibres.bin

Used by `js/about-brain.js` (the animated brain behind Tina's profile card on the About page).
Built by `tools/brain-fibres.py` from three open datasets:

## 1. White-matter fibres: HCP1065 tractography atlas
About 3,000 streamlines sampled from the HCP1065 population-averaged tractography atlas:
Yeh, F.-C. (2022). Population-based tract-to-region connectome of the human brain and its hierarchical topology.
*Nature Communications* 13, 4933. https://doi.org/10.1038/s41467-022-32595-4

- Source: https://github.com/frankyeh/data-atlas/releases/download/hcp1065/hcp1065_avg_tracts_trk.zip
- Licence: Creative Commons Attribution-ShareAlike 4.0. This file is a derivative and is shared under the same licence.
- Data were provided in part by the Human Connectome Project, WU-Minn Consortium (Principal Investigators: David Van Essen and
  Kamil Ugurbil; 1U54MH091657) funded by the 16 NIH Institutes and Centers that support the NIH Blueprint for Neuroscience
  Research; and by the McDonnell Center for Systems Neuroscience at Washington University.

## 2. Brain surface: ICBM152 (via NiiVue)
The "glass" cortex is 10,242 points of the left-hemisphere ICBM152 surface mesh shipped with NiiVue
(`BrainMesh_ICBM152.lh.mz3`, https://github.com/niivue/niivue, BSD-2-Clause); the right hemisphere is drawn as its mirror.
ICBM 152 template: Copyright (C) 1993-2009 Louis Collins, McConnell Brain Imaging Centre, Montreal Neurological Institute,
McGill University. Fonov et al., NeuroImage 47 (2009) S102; NeuroImage 54 (2011) 313-327.

## 3. Neurons: Allen Cell Types Database (via BMTK)
Four mouse cortical neuron reconstructions (Scnn1a 473845048, Rorb 325404214, Nr5a1 471087815, Pvalb 470522102), from the
example morphologies in the Allen Institute's Brain Modeling ToolKit (https://github.com/AllenInstitute/bmtk, BSD-3-Clause).
© 2015 Allen Institute for Brain Science. Allen Cell Types Database. Available from: celltypes.brain-map.org.

## Rebuild
Needs `pip install nibabel numpy`. From the unzipped atlas folder, the NiiVue mesh and a folder with the four .swc files:

    python3 tools/brain-fibres.py hcp1065_avg_tracts_trk data/brain-fibres.bin 3000 21 --mesh BrainMesh_ICBM152.lh.mz3 --swc swc/

Arguments: number of streamlines (keep points x streamlines under 65,536) and points per streamline.
