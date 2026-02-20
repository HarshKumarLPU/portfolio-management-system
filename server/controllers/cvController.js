import PDFDocument from 'pdfkit'
import Portfolio from '../models/Portfolio.js'
import User from '../models/User.js'

export const generateCV = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const portfolio = await Portfolio.findOne({ user: req.user._id })

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' })
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' })

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${user.username}-cv.pdf"`
    )

    // Pipe PDF to response
    doc.pipe(res)

    // ── HELPER FUNCTIONS ──
    const drawLine = () => {
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#e2e8f0').moveDown(0.5)
    }

    const sectionTitle = (title) => {
      doc.moveDown(0.5)
      doc
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text(title.toUpperCase(), 50, doc.y)
      doc.moveDown(0.3)
      drawLine()
    }

    // ────────────────────────────
    // HEADER SECTION
    // ────────────────────────────
    doc
      .fontSize(26)
      .font('Helvetica-Bold')
      .fillColor('#1e293b')
      .text(user.fullName, 50, 50, { align: 'center' })

    doc.moveDown(0.3)

    if (portfolio.title) {
      doc
        .fontSize(13)
        .font('Helvetica')
        .fillColor('#6366f1')
        .text(portfolio.title, { align: 'center' })
    }

    doc.moveDown(0.3)

    // Contact info line
    const contactParts = []
    if (user.email) contactParts.push(user.email)
    if (portfolio.location) contactParts.push(portfolio.location)
    if (portfolio.github) contactParts.push(portfolio.github)
    if (portfolio.linkedin) contactParts.push(portfolio.linkedin)

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#64748b')
      .text(contactParts.join('  |  '), { align: 'center' })

    doc.moveDown(0.5)
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .lineWidth(2)
      .stroke('#6366f1')
      .moveDown(0.8)

    // ────────────────────────────
    // ABOUT SECTION
    // ────────────────────────────
    if (portfolio.about) {
      sectionTitle('Profile')
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#334155')
        .text(portfolio.about, 50, doc.y, {
          width: 495,
          align: 'justify',
          lineGap: 3,
        })
      doc.moveDown(0.8)
    }

    // ────────────────────────────
    // EXPERIENCE SECTION
    // ────────────────────────────
    if (portfolio.experience?.length > 0) {
      sectionTitle('Work Experience')
      portfolio.experience.forEach((exp) => {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(exp.role, 50, doc.y)

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#6366f1')
          .text(exp.company, 50, doc.y)

        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor('#94a3b8')
          .text(exp.duration, 50, doc.y)

        if (exp.desc) {
          doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#334155')
            .text(`• ${exp.desc}`, 55, doc.y, {
              width: 490,
              lineGap: 2,
            })
        }
        doc.moveDown(0.7)
      })
    }

    // ────────────────────────────
    // EDUCATION SECTION
    // ────────────────────────────
    if (portfolio.education?.length > 0) {
      sectionTitle('Education')
      portfolio.education.forEach((edu) => {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(edu.degree, 50, doc.y)

        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#6366f1')
          .text(edu.school, 50, doc.y)

        const eduDetails = []
        if (edu.duration) eduDetails.push(edu.duration)
        if (edu.grade) eduDetails.push(edu.grade)

        doc
          .fontSize(9)
          .font('Helvetica')
          .fillColor('#94a3b8')
          .text(eduDetails.join('  |  '), 50, doc.y)

        doc.moveDown(0.7)
      })
    }

    // ────────────────────────────
    // SKILLS SECTION
    // ────────────────────────────
    if (portfolio.skills?.length > 0) {
      sectionTitle('Skills')

      const skillsPerRow = 3
      const skillWidth = 160
      const skillHeight = 20
      let xPos = 50
      let yPos = doc.y

      portfolio.skills.forEach((skill, index) => {
        if (index > 0 && index % skillsPerRow === 0) {
          xPos = 50
          yPos += skillHeight + 8
        }

        // Skill name
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(skill.name, xPos, yPos, { width: 80 })

        // Progress bar background
        doc
          .rect(xPos + 85, yPos + 3, 70, 7)
          .fillColor('#e2e8f0')
          .fill()

        // Progress bar fill
        doc
          .rect(xPos + 85, yPos + 3, (70 * skill.level) / 100, 7)
          .fillColor('#6366f1')
          .fill()

        // Percentage
        doc
          .fontSize(8)
          .font('Helvetica')
          .fillColor('#64748b')
          .text(`${skill.level}%`, xPos + 158, yPos + 2)

        xPos += skillWidth + 5
      })

      doc.moveDown(
        Math.ceil(portfolio.skills.length / skillsPerRow) * 1.5
      )
    }

    // ────────────────────────────
    // PROJECTS SECTION
    // ────────────────────────────
    if (portfolio.projects?.length > 0) {
      sectionTitle('Projects')
      portfolio.projects.forEach((project) => {
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#1e293b')
          .text(project.title, 50, doc.y)

        if (project.tags?.length > 0) {
          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor('#6366f1')
            .text(project.tags.join(', '), 50, doc.y)
        }

        if (project.desc) {
          doc
            .fontSize(10)
            .font('Helvetica')
            .fillColor('#334155')
            .text(`• ${project.desc}`, 55, doc.y, {
              width: 490,
              lineGap: 2,
            })
        }

        const links = []
        if (project.github) links.push(`GitHub: ${project.github}`)
        if (project.live) links.push(`Live: ${project.live}`)

        if (links.length > 0) {
          doc
            .fontSize(9)
            .font('Helvetica')
            .fillColor('#94a3b8')
            .text(links.join('  |  '), 55, doc.y)
        }

        doc.moveDown(0.7)
      })
    }

    // ────────────────────────────
    // FOOTER
    // ────────────────────────────
    doc.moveDown(1)
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .lineWidth(1)
      .stroke('#e2e8f0')
      .moveDown(0.5)

    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text(
        `Generated by PortFolio App • ${new Date().toLocaleDateString()}`,
        { align: 'center' }
      )

    // Finalize PDF
    doc.end()

    // Update CV download count
    await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { cvDownloads: 1 } }
    )

  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ message: 'Failed to generate CV' })
  }
}