## The What

A single-page portfolio website showcasing professional experience, technical skills, and personal projects. The site features a hero section with seamless looping video backgrounds, a tabbed skills banner with detailed breakdowns per technology, a work timeline, and a personal projects gallery with filterable cards and detail popups.

## The Why

A standard portfolio template doesn't reflect someone who builds custom experiences for a living. This portfolio is itself a demonstration of the work it describes, built from scratch with custom scroll interactions, video systems, and animations rather than relying on a template or page builder.

## The How

The video background system uses a cross-fade technique with two video elements per container, swapping seamlessly at loop boundaries to avoid the visible gap that comes with native video looping. Background videos are globally fixed and clipped dynamically based on scroll position, so different sections reveal different backgrounds as the user scrolls.

The sticky header uses FLIP (First, Last, Invert, Play) animations to smoothly transition the hero name and social links from the hero section into a compact fixed header as the user scrolls past. Locomotive Scroll handles smooth scrolling and provides scroll position data that drives the video clipping, parallax effects, and section transitions.
