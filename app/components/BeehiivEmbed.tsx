'use client'

export default function BeehiivEmbed() {
  return (
    <div className="w-full max-w-[428px] min-w-0">
      <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
      <iframe
        src="https://subscribe-forms.beehiiv.com/d6bc16f6-c4d8-43f5-9b5b-f1d2bdf61d7b"
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
        frameBorder="0"
        scrolling="no"
        style={{
          width: '100%',
          minWidth: '0',
          height: '186px',
          margin: 0,
          borderRadius: '14px',
          backgroundColor: 'transparent',
          boxShadow: '0 0 #0000',
          maxWidth: '100%',
          maxHeight: '186px'
        }}
      />
    </div>
  )
}
