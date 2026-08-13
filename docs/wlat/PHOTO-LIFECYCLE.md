# Photo lifecycle

1. Photography phase opens for both entries together.
2. Competitor (or permitted teammate / photo support) captures or uploads JPEG/PNG/WebP ≤ 12 MB.
3. Client requests a short-lived object key; bytes POST to `/api/wlat/photos/:id/complete`.
4. Server sniffs magic bytes, stores content hash, strips identity from the judging path, marks submitted.
5. Next heat cannot open until both verified finals exist (unless an authorised restart path is active).
6. Physical mode: public sees photos only after event publication.
7. Online mode: judges see de-identified derivatives while the ballot is open.
8. After `completeEvent`, pours copy into the permanent member archive. Event archive does not delete them.
