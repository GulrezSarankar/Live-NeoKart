import React from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';

const nodes = [
  {
    id: '1',
    data: { label: 'Homepage' },
    position: { x: 250, y: 0 },
    style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#D3F4FF' },
  },
  {
    id: '2',
    data: { label: 'Category Page\n(/category/:name)' },
    position: { x: 100, y: 150 },
    style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#FFE4B5' },
  },
  {
    id: '3',
    data: { label: 'Product Details\n(/product/:id)' },
    position: { x: 400, y: 150 },
    style: { border: '1px solid #777', padding: 10, borderRadius: 5, background: '#B9EBCF' },
  },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Click Category', animated: true, style: { stroke: '#f6ab6c' } },
  { id: 'e1-3', source: '1', target: '3', label: 'Click Product', animated: true, style: { stroke: '#6c63ff' } },
  { id: 'e2-3', source: '2', target: '3', label: 'Click Product', animated: true, style: { stroke: '#6c63ff' } },
];

export default function FlowDiagram() {
  return (
    <div style={{ height: 300, border: '1px solid #ddd', borderRadius: 6 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
