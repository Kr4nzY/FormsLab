import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '../../../../lib/prismadb';
import serverAuth from '../../../../lib/serverAuth';

export async function getSurveyWithAnswers(surveyId: string, userId: string, filterUserName: string | undefined) {
  if(filterUserName === '' || filterUserName === undefined){
    filterUserName = undefined;
  }
  console.log(filterUserName);
  //filterUserName = '6574aa967d9d20ca02fe0e21';
  //filterUserName = undefined;
  const survey = await prismadb.survey.findFirst({
    where: {
      id: surveyId,
      userId: userId,
    },
    include: {
      questions: true,
      answers: {
        where:{
          userId: filterUserName,
        },
        include: {
          answerData: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return survey;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const requestMethod = req.method;
    const session = await serverAuth(req, res);
    console.log(session);
    const { id } = req.query;
    const { userName } = req.query;

    switch (requestMethod) {
      case 'GET': {
        const survey = await getSurveyWithAnswers(
          id as string,
          session.currentUser.id,
          userName as string | undefined
        );
        return res.status(200).json(survey);
      }

      case 'DELETE': {
        const survey = await prismadb.survey.findFirst({
          where: {
            id: id as string,
            userId: session.currentUser.id,
          },
        });

        if (!survey) {
          return res.status(404).end();
        }

        await prismadb.survey.delete({
          where: {
            id: id as string,
          },
        });

        return res.status(200).end();
      }

      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
