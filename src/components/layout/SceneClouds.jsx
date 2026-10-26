export default function SceneClouds({ clouds = [] }) {
  return (
    <div className="split__clouds" aria-hidden="true">
      {clouds.map(({ id, src, style }) => (
        <img key={id} src={src} alt="" className="split__cloud" style={style} />
      ))}
    </div>
  );
}