// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

document.addEventListener('DOMContentLoaded', function() {
    // Define documents to load
    const documents = {
        cv: {
            url: 'Assets/Sajjad_Mighani_CV.pdf',
            viewerId: 'cvViewer',
            infoId: 'cvPageInfo',
            name: 'CV'
        },
        resume: {
            url: 'Assets/Sajjad_Mighani_Resume.pdf',
            viewerId: 'resumeViewer',
            infoId: 'resumePageInfo',
            name: 'Resume'
        }
    };

    // Load and render PDF document
    async function loadPDF(docType) {
        const doc = documents[docType];
        const pdfViewer = document.getElementById(doc.viewerId);
        const pdfPageInfo = document.getElementById(doc.infoId);

        // Return early if elements don't exist
        if (!pdfViewer || !pdfPageInfo) {
            return;
        }

        try {
            pdfPageInfo.textContent = `Loading ${doc.name}...`;
            
            // Load PDF document
            const pdf = await pdfjsLib.getDocument(doc.url).promise;
            
            pdfViewer.innerHTML = ''; // Clear previous content
            
            // Render all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const scale = 1.8;
                const viewport = page.getViewport({ scale });
                
                // Create canvas for this page
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                
                // Render page to canvas
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;
                
                // Create page container
                const pageContainer = document.createElement('div');
                pageContainer.className = 'pdf-page';
                pageContainer.appendChild(canvas);
                pdfViewer.appendChild(pageContainer);
            }
            
            // Update page info
            pdfPageInfo.textContent = `${pdf.numPages} page${pdf.numPages !== 1 ? 's' : ''}`;
            
        } catch (error) {
            console.error(`Error loading ${doc.name}:`, error);
            pdfPageInfo.textContent = `Unable to load ${doc.name}`;
            pdfPageInfo.style.color = '#ff3333';
        }
    }
    
    // Load both documents
    loadPDF('cv');
    loadPDF('resume');
});
