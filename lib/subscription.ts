import prisma from "@/lib/prisma"

export async function getActiveTermlySubscription(params: {
  teacherId: number
  year: number
  term: string
}) {
  return prisma.subscription.findFirst({
    where: {
      teacherId: params.teacherId,
      year: params.year,
      term: params.term,
      planType: "TERMLY",
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getActiveOneDocumentAccess(teacherId: number) {
  return prisma.subscription.findFirst({
    where: {
      teacherId,
      planType: "ONE_DOCUMENT",
      status: "active",
      documentsAllowed: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function canGenerateDocument(params: {
  teacherId: number
  year: number
  term: string
}) {
  const termly = await getActiveTermlySubscription({
    teacherId: params.teacherId,
    year: params.year,
    term: params.term,
  })

  if (termly) {
    return {
      allowed: true,
      mode: "TERMLY" as const,
      subscription: termly,
    }
  }

  const oneDoc = await getActiveOneDocumentAccess(params.teacherId)

  if (
    oneDoc &&
    oneDoc.documentsAllowed !== null &&
    oneDoc.documentsUsed < oneDoc.documentsAllowed
  ) {
    return {
      allowed: true,
      mode: "ONE_DOCUMENT" as const,
      subscription: oneDoc,
    }
  }

  return {
    allowed: false,
    mode: null,
    subscription: null,
  }
}