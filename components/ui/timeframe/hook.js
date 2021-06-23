import { useState, useEffect } from 'react';

// Simple algo to check if one rect is present in another rect.
const isHidden = (r1, r2) => r2.left >= r1.right || r2.right <= r1.left;

// Handles initial offset based on selected index,
// This makes sure the selected item is visible on screen
const handleOffset = (selectedIndex, rootSize, dataLen, ref, tileRefs) => {
  const offset = selectedIndex * rootSize;
  const endOffset = rootSize * dataLen - rootSize * 4;

  if (offset > endOffset) {
    return endOffset;
  }

  const next = tileRefs?.current[selectedIndex + 1];
  const prev = tileRefs?.current[selectedIndex - 1];

  let calcOffset = offset;

  // Check if we need to move offset, as in (next/prev item is not visible on screen)
  const rectOffset = ref.current.getBoundingClientRect();
  if (next && isHidden(rectOffset, next.getBoundingClientRect())) {
    calcOffset -= rootSize;
  }
  if (prev && isHidden(rectOffset, prev.getBoundingClientRect())) {
    calcOffset += rootSize;
  }

  return calcOffset;
};

// Checks if tiles are visible on screen based on ref rects for each tile
const getVisibleLabels = (bound, tiles) => {
  const matches = [];
  if (!bound) return null;
  tiles.forEach((tile) => {
    if (!isHidden(bound, tile.getBoundingClientRect())) {
      matches.push(tile.dataset.index);
    }
  });
  if (matches.length) {
    return [
      parseInt(matches[0], 10),
      parseInt(matches[matches.length - 1], 10),
    ];
  }
  return [0, 0];
};

function useTimeline(ref, tileRefs, data, selectedIndex, dotSize, onChange) {
  const [initialized, setInitialized] = useState(false);
  const [timeline, setTimeline] = useState({
    tileWidth: 0,
    dataWidth: 0,
    buttonWidth: 0,
    offset: 0,
  });
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const [labels, setLabels] = useState([0, 0]);
  const [offset, setOffset] = useState(null);

  useEffect(() => {
    if (
      ref.current &&
      data &&
      Array.isArray(data) &&
      tileRefs.current &&
      tileRefs.current.length === data.length
    ) {
      const rect = ref.current.getBoundingClientRect();
      const tileWidth = rect.width / 4;
      const dataWidth = tileWidth * data.length;
      const buttonWidth = tileWidth / 2 - dotSize / 2;

      setTimeline({
        tileWidth,
        dataWidth,
        startOffset: 0,
        endOffset: dataWidth - tileWidth * 4,
        buttonWidth,
      });
    }
  }, [ref, tileRefs, data, dotSize, selectedIndex]);

  useEffect(() => {
    if (!initialized && timeline.tileWidth && timeline.dataWidth) {
      const timeout = setTimeout(() => {
        const initialOffset = handleOffset(
          selectedIndex,
          timeline.tileWidth,
          data.length,
          ref,
          tileRefs
        );
        setOffset(initialOffset);
        setInitialized(true);
      }, 10);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [timeline, initialized]);

  useEffect(() => {
    if (ref.current) {
      const timeout = setTimeout(() => {
        if (ref.current) {
          const visibleLabels = getVisibleLabels(
            ref.current.getBoundingClientRect(),
            tileRefs.current
          );
          setLabels(visibleLabels);
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [ref, tileRefs, activeIndex]);

  useEffect(() => {
    const { tileWidth } = timeline;
    const timeout = setTimeout(() => {
      const next = tileRefs?.current[activeIndex + 1];
      const prev = tileRefs?.current[activeIndex - 1];

      // Check if we need to move offset, as in (next/prev item is not visible on screen)
      const rectOffset = ref.current.getBoundingClientRect();
      if (next && isHidden(rectOffset, next.getBoundingClientRect())) {
        const calcOffset = offset + tileWidth;
        setOffset(calcOffset);
      }
      if (prev && isHidden(rectOffset, prev.getBoundingClientRect())) {
        const calcOffset = offset - tileWidth;
        setOffset(calcOffset);
      }
    }, 10);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  function moveTimeline(dir) {
    if (dir === 'prev') {
      if (activeIndex !== 0) {
        setActiveIndex(activeIndex - 1);
        onChange(data[activeIndex - 1]);
        return;
      }
      return;
    }
    if (dir === 'next') {
      if (activeIndex !== data.length - 1 && activeIndex < data.length - 1) {
        setActiveIndex(activeIndex + 1);
        onChange(data[activeIndex + 1]);
      }
    }
  }

  function setSelected(index) {
    setActiveIndex(index);
    onChange(data[index]);
  }

  return [timeline, activeIndex, offset, labels, setSelected, moveTimeline];
}

export default useTimeline;
