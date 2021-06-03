import { useState, useEffect } from 'react';

// Simple algo to check if one rect is present in another rect.
const isHidden = (r1, r2) => r2.left >= r1.right || r2.right <= r1.left;

// Handles initial offset based on selected index,
// This makes sure the selected item is visible on screen
const handleOffset = (selectedIndex, rootSize, dataLen) => {
  const offset = selectedIndex * rootSize;
  const endOffset = rootSize * dataLen - rootSize * 4;

  if (offset > endOffset) {
    return endOffset;
  }

  return offset;
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
    return [matches[0], matches[matches.length - 1]];
  }
  return [0, 0];
};

function useTimeline(ref, tileRefs, data, selectedIndex, dotSize) {
  const [timeline, setTimeline] = useState({
    tileWidth: 0,
    dataWidth: 0,
    buttonWidth: 0,
    offset: 0,
  });
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const [labels, setLabels] = useState([0, 0]);
  const [offset, setOffset] = useState(0);

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
      const newOffset = handleOffset(selectedIndex, tileWidth, data.length);

      setTimeline({
        tileWidth,
        dataWidth,
        startOffset: 0,
        endOffset: dataWidth - tileWidth * 4,
        buttonWidth,
      });
      setOffset(-Math.abs(newOffset));

      if (selectedIndex !== activeIndex) {
        setActiveIndex(selectedIndex);
      }
    }
  }, [ref, tileRefs, data, dotSize, selectedIndex]);

  useEffect(() => {
    if (ref.current) {
      setTimeout(() => {
        if (ref.current) {
          setLabels(
            getVisibleLabels(
              ref.current.getBoundingClientRect(),
              tileRefs.current
            )
          );
        }
      });
    }
  }, [ref, tileRefs, activeIndex]);

  function moveTimeline(dir, setIndex = true) {
    const { startOffset, endOffset, tileWidth } = timeline;

    if (dir === 'prev' && offset === startOffset) {
      if (activeIndex !== 0) {
        setActiveIndex(activeIndex - 1);
        return;
      }
      return;
    }

    if (dir === 'next' && Math.abs(offset) === endOffset) {
      if (activeIndex !== data.length - 1 && activeIndex < data.length - 1) {
        setActiveIndex(activeIndex + 1);
        return;
      }
      return;
    }

    const calcOffset = dir === 'next' ? offset - tileWidth : offset + tileWidth;
    if (setIndex) {
      const newIndex = dir === 'next' ? activeIndex + 1 : activeIndex - 1;

      const rectOffset = ref.current.getBoundingClientRect();
      const next = tileRefs?.current[newIndex + 1];
      const prev = tileRefs?.current[newIndex - 1];

      // Check if we need to move offset, as in (next/prev item is not visible on screen)
      if (
        (next && isHidden(rectOffset, next.getBoundingClientRect())) ||
        (prev && isHidden(rectOffset, prev.getBoundingClientRect()))
      ) {
        setOffset(calcOffset);
      }
      setActiveIndex(newIndex);
      return;
    }

    setOffset(calcOffset);
  }

  function setSelected(index) {
    const next = tileRefs?.current[index + 1];
    const prev = tileRefs?.current[index - 1];

    // Check if we need to move offset, as in (next/prev item is not visible on screen)
    const rectOffset = ref.current.getBoundingClientRect();
    if (next && isHidden(rectOffset, next.getBoundingClientRect())) {
      moveTimeline('next', false);
    }
    if (prev && isHidden(rectOffset, prev.getBoundingClientRect())) {
      moveTimeline('prev', false);
    }
    setActiveIndex(index);
  }

  return [timeline, activeIndex, offset, labels, setSelected, moveTimeline];
}

export default useTimeline;
