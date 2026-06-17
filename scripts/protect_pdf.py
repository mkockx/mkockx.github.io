import io, math, sys
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from pypdf import PdfReader, PdfWriter
from pypdf.constants import UserAccessPermissions

OWNER = "MK-owner-7c2f9a1e-protect"
WMARK = "Martin Kockx  ·  © 2026  ·  do not redistribute"

def overlay(w, h):
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=(w, h))
    c.saveState()
    c.setFillColor(Color(0.45, 0.45, 0.45, alpha=0.11))
    c.setFont("Helvetica-Bold", 15)
    c.translate(w/2, h/2); c.rotate(45)
    diag = math.hypot(w, h)
    yy = -diag
    while yy < diag:
        xx = -diag
        while xx < diag:
            c.drawCentredString(xx, yy, WMARK)
            xx += 360
        yy += 135
    c.restoreState(); c.save()
    buf.seek(0)
    return PdfReader(buf).pages[0]

def process(src, dst):
    r = PdfReader(src); w = PdfWriter()
    for p in r.pages:
        box = p.mediabox
        ov = overlay(float(box.width), float(box.height))
        p.merge_page(ov)
        w.add_page(p)
    w.encrypt(user_password="", owner_password=OWNER,
              permissions_flag=UserAccessPermissions.PRINT | UserAccessPermissions.PRINT_TO_REPRESENTATION,
              algorithm="AES-256")
    with open(dst, "wb") as f:
        w.write(f)
    print("wrote", dst, "pages:", len(r.pages))

process("/tmp/papers_pdf/white-paper-v2.pdf",
        "papers/files/sandboxes-stewards-governance-gap-v2.pdf")
process("/tmp/papers_pdf/From Design to Deployment - A Digital Architecture Strategy_v6.0.pdf",
        "papers/files/from-design-to-deployment-thesis-v6.pdf")
